import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Modal, Alert, KeyboardAvoidingView,
  Platform, FlatList, Dimensions, Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORAGE_KEY = '@couple_connect_savings';

const FUNDS = [
  { id: 'our_fund',       name: 'Our Fund',       emoji: '💑', color: '#C0394B', gradient: ['#C0394B','#E8617A'], description: 'Shared savings for us' },
  { id: 'gift_fund',      name: 'Gift Fund',       emoji: '🎁', color: '#7B5EA7', gradient: ['#7B5EA7','#A07DC8'], description: 'Future gifts & surprises' },
  { id: 'emergency_fund', name: 'Emergency Fund',  emoji: '🛡️', color: '#2E7D6B', gradient: ['#2E7D6B','#4CA88E'], description: 'Safety net for rainy days' },
];

const DEFAULT_SPLITS = { our_fund: 33.33, gift_fund: 33.33, emergency_fund: 33.34 };

const initialFundState = () =>
  FUNDS.reduce((acc, f) => { acc[f.id] = { balance: 0, transactions: [] }; return acc; }, {});

const fmt = (val) => val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// ─── Donut Chart (pure RN, no extra libs) ────────────────────────────────────
function DonutChart({ funds, fundData, total }) {
  const size = SCREEN_WIDTH - 80;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 20;
  const strokeW = 28;
  const r = R - strokeW / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const slices = FUNDS.map((fund) => {
    const pct = total > 0 ? fundData[fund.id].balance / total : 1 / FUNDS.length;
    const slice = { fund, pct, offset };
    offset += pct;
    return slice;
  });

  // SVG arc helper
  const polarToCartesian = (angle) => ({
    x: cx + r * Math.cos((angle - 0.5) * 2 * Math.PI),
    y: cy + r * Math.sin((angle - 0.5) * 2 * Math.PI),
  });

  const arcPath = (startPct, endPct) => {
    if (endPct - startPct >= 1) endPct = startPct + 0.9999;
    const s = polarToCartesian(startPct);
    const e = polarToCartesian(endPct);
    const large = endPct - startPct > 0.5 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <View style={{ alignItems: 'center', marginVertical: 8 }}>
      <View style={{ width: size, height: size }}>
        {/* Background circle */}
        <View style={{
          position: 'absolute', width: size, height: size,
          borderRadius: size / 2, borderWidth: strokeW,
          borderColor: '#F0E8EA',
        }} />
        {/* SVG slices via border trick — use colored arcs as overlapping views */}
        {/* We'll use a different approach: stacked ring segments with transform */}
        {slices.map(({ fund, pct, offset: off }) => {
          const degrees = pct * 360;
          const startDeg = off * 360 - 90;
          return (
            <View
              key={fund.id}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: size / 2,
                overflow: 'hidden',
              }}
            >
              <View style={{
                position: 'absolute',
                width: size,
                height: size / 2,
                top: 0,
                left: 0,
                overflow: 'hidden',
                transform: [{ rotate: `${startDeg}deg` }],
                transformOrigin: `${cx}px ${size / 2}px`,
              }}>
                <View style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeW,
                  borderColor: fund.color,
                  top: 0,
                  left: 0,
                }} />
              </View>
            </View>
          );
        })}
        {/* Center label */}
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 11, color: '#9E8A90', textTransform: 'uppercase', letterSpacing: 1 }}>Total</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#1A0A0E' }}>{fmt(total)}</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 4 }}>
        {FUNDS.map((fund) => {
          const pct = total > 0 ? (fundData[fund.id].balance / total * 100).toFixed(1) : '0.0';
          return (
            <View key={fund.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: fund.color }} />
              <Text style={{ fontSize: 12, color: '#6B5B65' }}>{fund.emoji} {fund.name} {pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ funds, fundData }) {
  const maxVal = Math.max(...FUNDS.map(f => {
    const txs = fundData[f.id].transactions;
    const dep = txs.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
    const wit = txs.filter(t => t.type === 'withdraw').reduce((s, t) => s + t.amount, 0);
    return Math.max(dep, wit, 1);
  }));

  return (
    <View style={{ marginTop: 8 }}>
      {FUNDS.map((fund) => {
        const txs = fundData[fund.id].transactions;
        const deposited = txs.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
        const withdrawn = txs.filter(t => t.type === 'withdraw').reduce((s, t) => s + t.amount, 0);
        const depPct = deposited / maxVal;
        const witPct = withdrawn / maxVal;
        const barW = SCREEN_WIDTH - 120;

        return (
          <View key={fund.id} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 15 }}>{fund.emoji}</Text>
              <Text style={{ fontWeight: '600', color: '#1A0A0E', fontSize: 13, marginLeft: 6 }}>{fund.name}</Text>
            </View>
            {/* Deposited bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ width: 60, fontSize: 11, color: '#9E8A90' }}>Saved</Text>
              <View style={{ flex: 1, height: 12, backgroundColor: '#F0E8EA', borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ width: `${depPct * 100}%`, height: 12, backgroundColor: fund.color, borderRadius: 6 }} />
              </View>
              <Text style={{ marginLeft: 8, fontSize: 11, color: fund.color, fontWeight: '700', width: 60, textAlign: 'right' }}>{fmt(deposited)}</Text>
            </View>
            {/* Withdrawn bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ width: 60, fontSize: 11, color: '#9E8A90' }}>Withdrawn</Text>
              <View style={{ flex: 1, height: 12, backgroundColor: '#F0E8EA', borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ width: `${witPct * 100}%`, height: 12, backgroundColor: '#E8C0C8', borderRadius: 6 }} />
              </View>
              <Text style={{ marginLeft: 8, fontSize: 11, color: '#C0394B', fontWeight: '700', width: 60, textAlign: 'right' }}>{fmt(withdrawn)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SavingsTracker() {
  const [funds, setFunds] = useState(initialFundState());
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'funds'
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [step, setStep] = useState('amount');
  const [totalAmount, setTotalAmount] = useState('');
  const [note, setNote] = useState('');
  const [splits, setSplits] = useState({ ...DEFAULT_SPLITS });
  const [splitError, setSplitError] = useState('');
  const [withdrawFundId, setWithdrawFundId] = useState(FUNDS[0].id);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');

  useEffect(() => { loadFunds(); }, []);

  const loadFunds = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setFunds(JSON.parse(saved));
    } catch (e) { console.error(e); }
  };

  const saveFunds = async (u) => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u)); }
    catch (e) { console.error(e); }
  };

  // ── Stats ──
  const totalSavings = Object.values(funds).reduce((s, f) => s + f.balance, 0);
  const totalDeposited = FUNDS.reduce((s, f) =>
    s + funds[f.id].transactions.filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0), 0);
  const totalWithdrawn = FUNDS.reduce((s, f) =>
    s + funds[f.id].transactions.filter(t => t.type === 'withdraw').reduce((a, t) => a + t.amount, 0), 0);

  // ── Add Cash ──
  const openAddModal = () => {
    setTotalAmount(''); setNote(''); setSplits({ ...DEFAULT_SPLITS }); setSplitError(''); setStep('amount');
    setAddModalVisible(true);
  };

  const goToSplitStep = () => {
    const p = parseFloat(totalAmount);
    if (!p || p <= 0) { Alert.alert('Invalid amount', 'Enter a valid amount.'); return; }
    setSplits({ ...DEFAULT_SPLITS }); setSplitError(''); setStep('split');
  };

  const updateSplit = (id, val) => {
    const u = { ...splits, [id]: val === '' ? '' : parseFloat(val) || 0 };
    setSplits(u);
    const t = Object.values(u).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    setSplitError(Math.abs(t - 100) > 0.1 ? `Must total 100% (currently ${t.toFixed(1)}%)` : '');
  };

  const handleDeposit = () => {
    const parsed = parseFloat(totalAmount);
    const t = Object.values(splits).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    if (Math.abs(t - 100) > 0.1) { setSplitError(`Must total 100% (currently ${t.toFixed(1)}%)`); return; }
    const ts = Date.now();
    const u = { ...funds };
    FUNDS.forEach((fund, i) => {
      const pct = parseFloat(splits[fund.id]) || 0;
      const amt = parseFloat(((pct / 100) * parsed).toFixed(2));
      u[fund.id] = {
        balance: parseFloat((funds[fund.id].balance + amt).toFixed(2)),
        transactions: [{ id: `${ts}_${i}`, type: 'deposit', amount: amt, note: note.trim() || null, date: new Date().toISOString(), splitPct: pct }, ...funds[fund.id].transactions],
      };
    });
    setFunds(u); saveFunds(u); setAddModalVisible(false);
  };

  // ── Withdraw ──
  const openWithdrawModal = () => {
    setWithdrawFundId(FUNDS[0].id); setWithdrawAmount(''); setWithdrawNote('');
    setWithdrawModalVisible(true);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0) { Alert.alert('Invalid amount', 'Enter a valid amount.'); return; }
    const fund = funds[withdrawFundId];
    if (amt > fund.balance) { Alert.alert('Insufficient funds', `Only ${fmt(fund.balance)} available.`); return; }
    const u = {
      ...funds,
      [withdrawFundId]: {
        balance: parseFloat((fund.balance - amt).toFixed(2)),
        transactions: [{ id: Date.now().toString(), type: 'withdraw', amount: amt, note: withdrawNote.trim() || null, date: new Date().toISOString() }, ...fund.transactions],
      },
    };
    setFunds(u); saveFunds(u); setWithdrawModalVisible(false);
  };

  // ── Export CSV ──
  const exportCSV = async () => {
    let csv = 'Fund,Date,Type,Amount,Note,Split%\n';
    FUNDS.forEach(fund => {
      funds[fund.id].transactions.forEach(tx => {
        const row = [
          fund.name,
          fmtDate(tx.date),
          tx.type === 'deposit' ? 'Deposit' : 'Withdrawal',
          tx.amount.toFixed(2),
          tx.note ? `"${tx.note}"` : '',
          tx.splitPct != null ? tx.splitPct : '',
        ];
        csv += row.join(',') + '\n';
      });
    });
    // Summary footer
    csv += '\nSUMMARY\n';
    csv += `Total Saved,${totalSavings.toFixed(2)}\n`;
    csv += `Total Deposited,${totalDeposited.toFixed(2)}\n`;
    csv += `Total Withdrawn,${totalWithdrawn.toFixed(2)}\n`;
    FUNDS.forEach(f => {
      csv += `${f.name} Balance,${funds[f.id].balance.toFixed(2)}\n`;
    });

    try {
      const path = FileSystem.documentDirectory + `CoupleConnect_Savings_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Export Savings CSV' });
    } catch (e) {
      Alert.alert('Export failed', e.message);
    }
  };

  // ── Export PDF (HTML-based) ──
  const exportPDF = async () => {
    const rows = FUNDS.flatMap(fund =>
      funds[fund.id].transactions.map(tx => `
        <tr>
          <td>${fund.emoji} ${fund.name}</td>
          <td>${fmtDate(tx.date)}</td>
          <td style="color:${tx.type === 'deposit' ? '#2E7D6B' : '#C0394B'}">${tx.type === 'deposit' ? '▲ Deposit' : '▼ Withdrawal'}</td>
          <td style="font-weight:700">${tx.type === 'deposit' ? '+' : '-'}$${tx.amount.toFixed(2)}</td>
          <td>${tx.note || '—'}</td>
          <td>${tx.splitPct != null ? tx.splitPct + '%' : '—'}</td>
        </tr>`)
    ).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
    <style>
      body { font-family: -apple-system, sans-serif; padding: 32px; color: #1A0A0E; }
      h1 { color: #C0394B; margin-bottom: 4px; }
      .subtitle { color: #9E8A90; margin-bottom: 24px; font-size: 13px; }
      .stats { display: flex; gap: 16px; margin-bottom: 28px; }
      .stat { background: #FAF7F5; border-radius: 12px; padding: 16px 20px; flex: 1; }
      .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9E8A90; }
      .stat-val { font-size: 22px; font-weight: 800; margin-top: 4px; }
      .fund-stat { background: #FAF7F5; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px; display: flex; justify-content: space-between; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { background: #3D1520; color: #fff; padding: 10px 12px; text-align: left; }
      td { padding: 9px 12px; border-bottom: 1px solid #F0E8EA; }
      tr:nth-child(even) td { background: #FDF9FA; }
      .footer { margin-top: 24px; color: #B09098; font-size: 11px; }
    </style></head><body>
    <h1>💑 CoupleConnect Savings Report</h1>
    <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
    <div class="stats">
      <div class="stat"><div class="stat-label">Current Balance</div><div class="stat-val" style="color:#C0394B">$${totalSavings.toFixed(2)}</div></div>
      <div class="stat"><div class="stat-label">Total Deposited</div><div class="stat-val" style="color:#2E7D6B">$${totalDeposited.toFixed(2)}</div></div>
      <div class="stat"><div class="stat-label">Total Withdrawn</div><div class="stat-val" style="color:#7B5EA7">$${totalWithdrawn.toFixed(2)}</div></div>
    </div>
    <h3 style="margin-bottom:10px">Per Fund Balances</h3>
    ${FUNDS.map(f => `<div class="fund-stat"><span>${f.emoji} ${f.name}</span><strong>$${funds[f.id].balance.toFixed(2)}</strong></div>`).join('')}
    <h3 style="margin: 24px 0 10px">Transaction History</h3>
    <table><thead><tr><th>Fund</th><th>Date</th><th>Type</th><th>Amount</th><th>Note</th><th>Split</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="6" style="text-align:center;color:#9E8A90">No transactions yet</td></tr>'}</tbody></table>
    <div class="footer">CoupleConnect · Savings Tracker</div>
    </body></html>`;

    try {
      const htmlPath = FileSystem.documentDirectory + `savings_report.html`;
      await FileSystem.writeAsStringAsync(htmlPath, html, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(htmlPath, { mimeType: 'text/html', dialogTitle: 'Export Savings Report' });
    } catch (e) {
      Alert.alert('Export failed', e.message);
    }
  };

  const splitTotal = Object.values(splits).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const splitOk = Math.abs(splitTotal - 100) < 0.1;

  return (
    <View style={s.container}>
      {/* ── Header ── */}
      <LinearGradient colors={['#1A0A0E', '#3D1520']} style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerLabel}>Total Saved Together</Text>
            <Text style={s.totalAmount}>{fmt(totalSavings)}</Text>
          </View>
          <TouchableOpacity style={s.exportHeaderBtn} onPress={() => setExportModalVisible(true)}>
            <Ionicons name="download-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.statPill}>
            <Ionicons name="arrow-up-circle" size={14} color="#4CA88E" />
            <Text style={s.statPillLabel}>Saved</Text>
            <Text style={s.statPillVal}>{fmt(totalDeposited)}</Text>
          </View>
          <View style={s.statPillDivider} />
          <View style={s.statPill}>
            <Ionicons name="arrow-down-circle" size={14} color="#E8617A" />
            <Text style={s.statPillLabel}>Withdrawn</Text>
            <Text style={s.statPillVal}>{fmt(totalWithdrawn)}</Text>
          </View>
          <View style={s.statPillDivider} />
          <View style={s.statPill}>
            <Ionicons name="wallet" size={14} color="#A07DC8" />
            <Text style={s.statPillLabel}>Balance</Text>
            <Text style={s.statPillVal}>{fmt(totalSavings)}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={s.headerActions}>
          <TouchableOpacity style={s.actionPrimary} onPress={openAddModal}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.actionPrimaryTxt}>Add Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionSecondary} onPress={openWithdrawModal}>
            <Ionicons name="remove" size={18} color="#C0394B" />
            <Text style={s.actionSecondaryTxt}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={s.tabBar}>
          {['dashboard', 'funds'].map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>
                {t === 'dashboard' ? '📊 Dashboard' : '💰 Funds'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* ── Content ── */}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'dashboard' ? (
          <>
            {/* Donut */}
            <View style={s.card}>
              <Text style={s.sectionTitle}>Fund Distribution</Text>
              <DonutChart funds={FUNDS} fundData={funds} total={totalSavings} />
            </View>

            {/* Bar chart */}
            <View style={s.card}>
              <Text style={s.sectionTitle}>Saved vs Withdrawn</Text>
              <BarChart funds={FUNDS} fundData={funds} />
            </View>

            {/* Summary table */}
            <View style={s.card}>
              <Text style={s.sectionTitle}>Fund Summary</Text>
              {FUNDS.map(fund => {
                const txs = funds[fund.id].transactions;
                const dep = txs.filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0);
                const wit = txs.filter(t => t.type === 'withdraw').reduce((a, t) => a + t.amount, 0);
                return (
                  <View key={fund.id} style={s.summaryRow}>
                    <Text style={s.summaryEmoji}>{fund.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.summaryName}>{fund.name}</Text>
                      <View style={s.summaryStats}>
                        <Text style={s.summaryDep}>↑ {fmt(dep)}</Text>
                        <Text style={s.summaryWit}>↓ {fmt(wit)}</Text>
                      </View>
                    </View>
                    <Text style={s.summaryBal}>{fmt(funds[fund.id].balance)}</Text>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          FUNDS.map(fund => {
            const fundData = funds[fund.id];
            const pct = totalSavings > 0 ? (fundData.balance / totalSavings) * 100 : 0;
            const dep = fundData.transactions.filter(t => t.type === 'deposit').reduce((a, t) => a + t.amount, 0);
            const wit = fundData.transactions.filter(t => t.type === 'withdraw').reduce((a, t) => a + t.amount, 0);

            return (
              <View key={fund.id} style={s.card}>
                <LinearGradient colors={fund.gradient} style={s.cardHeader}>
                  <View style={s.cardHeaderLeft}>
                    <Text style={{ fontSize: 28 }}>{fund.emoji}</Text>
                    <View>
                      <Text style={s.cardName}>{fund.name}</Text>
                      <Text style={s.cardDesc}>{fund.description}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => { setSelectedFund(fund); setHistoryModalVisible(true); }} style={{ padding: 6 }}>
                    <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.85)" />
                  </TouchableOpacity>
                </LinearGradient>

                <View style={s.cardBody}>
                  <Text style={s.balanceLabel}>Balance</Text>
                  <Text style={s.balanceAmount}>{fmt(fundData.balance)}</Text>

                  <View style={s.miniStatsRow}>
                    <View style={s.miniStat}>
                      <Ionicons name="arrow-up-circle" size={14} color="#2E7D6B" />
                      <Text style={s.miniStatLabel}>Deposited</Text>
                      <Text style={[s.miniStatVal, { color: '#2E7D6B' }]}>{fmt(dep)}</Text>
                    </View>
                    <View style={s.miniStatDivider} />
                    <View style={s.miniStat}>
                      <Ionicons name="arrow-down-circle" size={14} color="#C0394B" />
                      <Text style={s.miniStatLabel}>Withdrawn</Text>
                      <Text style={[s.miniStatVal, { color: '#C0394B' }]}>{fmt(wit)}</Text>
                    </View>
                  </View>

                  <View style={s.progressTrack}>
                    <View style={[s.progressFill, { width: `${pct}%`, backgroundColor: fund.color }]} />
                  </View>
                  <Text style={s.progressPct}>{pct.toFixed(1)}% of total savings</Text>

                  {fundData.transactions[0] && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 }}>
                      <Ionicons name={fundData.transactions[0].type === 'deposit' ? 'arrow-up-circle' : 'arrow-down-circle'} size={13} color={fundData.transactions[0].type === 'deposit' ? '#2E7D6B' : '#C0394B'} />
                      <Text style={s.latestTxText}>
                        Last: {fundData.transactions[0].type === 'deposit' ? '+' : '-'}{fmt(fundData.transactions[0].amount)} · {fmtDate(fundData.transactions[0].date)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add Cash Modal ── */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.handle} />
            {step === 'amount' ? (
              <>
                <Text style={s.modalTitle}>💵 Add Cash</Text>
                <Text style={s.modalSub}>Total amount to split across all funds</Text>
                <Text style={s.inputLabel}>Amount (USD)</Text>
                <View style={s.inputRow}>
                  <Text style={s.currencySign}>$</Text>
                  <TextInput style={s.amountInput} placeholder="0.00" placeholderTextColor="#C4B0B5" keyboardType="decimal-pad" value={totalAmount} onChangeText={setTotalAmount} autoFocus />
                </View>
                <Text style={s.inputLabel}>Note (optional)</Text>
                <TextInput style={s.noteInput} placeholder="e.g. Weekly savings, bonus..." placeholderTextColor="#C4B0B5" value={note} onChangeText={setNote} />
                <TouchableOpacity style={s.confirmBtn} onPress={goToSplitStep}>
                  <Text style={s.confirmBtnTxt}>Next: Set Split →</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setAddModalVisible(false)}>
                  <Text style={s.cancelBtnTxt}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={s.modalTitle}>⚖️ Split ${parseFloat(totalAmount).toFixed(2)}</Text>
                <Text style={s.modalSub}>Adjust percentages — must total 100%</Text>
                <View style={[s.splitTotalBar, { borderColor: splitOk ? '#2E7D6B' : '#C0394B' }]}>
                  <Text style={[s.splitTotalTxt, { color: splitOk ? '#2E7D6B' : '#C0394B' }]}>{splitTotal.toFixed(1)}% of 100%</Text>
                  <Ionicons name={splitOk ? 'checkmark-circle' : 'alert-circle'} size={18} color={splitOk ? '#2E7D6B' : '#C0394B'} />
                </View>
                {FUNDS.map(fund => {
                  const pct = parseFloat(splits[fund.id]) || 0;
                  const preview = fmt((pct / 100) * (parseFloat(totalAmount) || 0));
                  return (
                    <View key={fund.id} style={s.splitRow}>
                      <View style={s.splitFundInfo}>
                        <Text style={{ fontSize: 22 }}>{fund.emoji}</Text>
                        <View>
                          <Text style={s.splitFundName}>{fund.name}</Text>
                          <Text style={[s.splitPreview, { color: fund.color }]}>→ {preview}</Text>
                        </View>
                      </View>
                      <View style={[s.splitInputWrap, { borderColor: fund.color }]}>
                        <TextInput style={s.splitInput} keyboardType="decimal-pad" value={splits[fund.id].toString()} onChangeText={v => updateSplit(fund.id, v)} selectTextOnFocus />
                        <Text style={s.splitPctSign}>%</Text>
                      </View>
                    </View>
                  );
                })}
                {splitError ? <Text style={s.splitError}>{splitError}</Text> : null}
                <TouchableOpacity style={[s.confirmBtn, { backgroundColor: splitOk ? '#2E7D6B' : '#aaa' }]} onPress={handleDeposit} disabled={!splitOk}>
                  <Text style={s.confirmBtnTxt}>Confirm & Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.cancelBtn} onPress={() => setStep('amount')}>
                  <Text style={s.cancelBtnTxt}>← Back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Withdraw Modal ── */}
      <Modal visible={withdrawModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.handle} />
            <Text style={s.modalTitle}>💸 Withdraw Cash</Text>
            <Text style={s.modalSub}>Choose which fund to withdraw from</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, width: '100%' }}>
              {FUNDS.map(fund => (
                <TouchableOpacity key={fund.id} style={[s.fundChip, withdrawFundId === fund.id && { backgroundColor: fund.color }]} onPress={() => setWithdrawFundId(fund.id)}>
                  <Text style={{ fontSize: 16 }}>{fund.emoji}</Text>
                  <Text style={[s.fundChipTxt, withdrawFundId === fund.id && { color: '#fff' }]}>{fund.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: '#9E8A90', fontSize: 12, marginBottom: 12, alignSelf: 'flex-start' }}>
              Available: {fmt(funds[withdrawFundId]?.balance || 0)}
            </Text>
            <Text style={s.inputLabel}>Amount (USD)</Text>
            <View style={s.inputRow}>
              <Text style={s.currencySign}>$</Text>
              <TextInput style={s.amountInput} placeholder="0.00" placeholderTextColor="#C4B0B5" keyboardType="decimal-pad" value={withdrawAmount} onChangeText={setWithdrawAmount} autoFocus />
            </View>
            <Text style={s.inputLabel}>Note (optional)</Text>
            <TextInput style={s.noteInput} placeholder="e.g. Anniversary dinner..." placeholderTextColor="#C4B0B5" value={withdrawNote} onChangeText={setWithdrawNote} />
            <TouchableOpacity style={[s.confirmBtn, { backgroundColor: '#C0394B' }]} onPress={handleWithdraw}>
              <Text style={s.confirmBtnTxt}>Record Withdrawal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setWithdrawModalVisible(false)}>
              <Text style={s.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── History Modal ── */}
      <Modal visible={historyModalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { maxHeight: '80%' }]}>
            <View style={s.handle} />
            {selectedFund && <Text style={s.modalTitle}>{selectedFund.emoji} {selectedFund.name} History</Text>}
            {selectedFund && funds[selectedFund.id].transactions.length === 0
              ? <Text style={{ color: '#B09098', fontSize: 15, marginVertical: 30 }}>No transactions yet!</Text>
              : <FlatList
                  data={selectedFund ? funds[selectedFund.id].transactions : []}
                  keyExtractor={item => item.id}
                  style={{ width: '100%' }}
                  renderItem={({ item }) => (
                    <View style={s.txRow}>
                      <Ionicons name={item.type === 'deposit' ? 'arrow-up-circle' : 'arrow-down-circle'} size={22} color={item.type === 'deposit' ? '#2E7D6B' : '#C0394B'} />
                      <View style={{ flex: 1 }}>
                        <Text style={s.txNote}>{item.note || (item.type === 'deposit' ? 'Cash deposit' : 'Cash withdrawal')}</Text>
                        <Text style={s.txDate}>{fmtDate(item.date)}{item.splitPct != null ? ` · ${item.splitPct}% split` : ''}</Text>
                      </View>
                      <Text style={[s.txAmount, { color: item.type === 'deposit' ? '#2E7D6B' : '#C0394B' }]}>
                        {item.type === 'deposit' ? '+' : '-'}{fmt(item.amount)}
                      </Text>
                    </View>
                  )}
                />
            }
            <TouchableOpacity style={[s.cancelBtn, { marginTop: 12 }]} onPress={() => setHistoryModalVisible(false)}>
              <Text style={s.cancelBtnTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Export Modal ── */}
      <Modal visible={exportModalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.handle} />
            <Text style={s.modalTitle}>📤 Export Report</Text>
            <Text style={s.modalSub}>Download your savings data</Text>
            <TouchableOpacity style={[s.exportBtn, { backgroundColor: '#2E7D6B' }]} onPress={() => { setExportModalVisible(false); exportCSV(); }}>
              <Ionicons name="document-text-outline" size={22} color="#fff" />
              <View style={{ marginLeft: 12 }}>
                <Text style={s.exportBtnTitle}>Export as CSV</Text>
                <Text style={s.exportBtnSub}>Open in Excel, Numbers, or Sheets</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[s.exportBtn, { backgroundColor: '#C0394B', marginTop: 12 }]} onPress={() => { setExportModalVisible(false); exportPDF(); }}>
              <Ionicons name="document-outline" size={22} color="#fff" />
              <View style={{ marginLeft: 12 }}>
                <Text style={s.exportBtnTitle}>Export as PDF Report</Text>
                <Text style={s.exportBtnSub}>Beautiful summary with all stats</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setExportModalVisible(false)}>
              <Text style={s.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF7F5' },
  header: { paddingTop: 56, paddingBottom: 0, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  totalAmount: { color: '#fff', fontSize: 38, fontWeight: '800', letterSpacing: -1 },
  exportHeaderBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10 },

  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 12, marginBottom: 14 },
  statPill: { flex: 1, alignItems: 'center', gap: 3 },
  statPillDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  statPillLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  statPillVal: { color: '#fff', fontSize: 13, fontWeight: '700' },

  headerActions: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  actionPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#C0394B', paddingVertical: 11, borderRadius: 12 },
  actionPrimaryTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  actionSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.12)', paddingVertical: 11, borderRadius: 12 },
  actionSecondaryTxt: { color: '#FFB0BC', fontWeight: '700', fontSize: 15 },

  tabBar: { flexDirection: 'row', gap: 4, marginBottom: 0 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#fff' },
  tabTxt: { color: 'rgba(255,255,255,0.45)', fontWeight: '600', fontSize: 14 },
  tabTxtActive: { color: '#fff' },

  scroll: { padding: 16, paddingTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4, padding: 16 },
  sectionTitle: { fontWeight: '700', fontSize: 16, color: '#1A0A0E', marginBottom: 8 },

  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5EDEF', gap: 10 },
  summaryEmoji: { fontSize: 22 },
  summaryName: { fontWeight: '600', color: '#1A0A0E', fontSize: 14 },
  summaryStats: { flexDirection: 'row', gap: 10, marginTop: 2 },
  summaryDep: { fontSize: 12, color: '#2E7D6B', fontWeight: '500' },
  summaryWit: { fontSize: 12, color: '#C0394B', fontWeight: '500' },
  summaryBal: { fontWeight: '800', color: '#1A0A0E', fontSize: 15 },

  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, margin: -16, marginBottom: 16, borderRadius: 0 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardName: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cardDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  cardBody: {},
  balanceLabel: { color: '#9E8A90', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  balanceAmount: { color: '#1A0A0E', fontSize: 30, fontWeight: '800', marginTop: 2, letterSpacing: -0.5 },
  miniStatsRow: { flexDirection: 'row', backgroundColor: '#FAF7F5', borderRadius: 12, padding: 10, marginTop: 12 },
  miniStat: { flex: 1, alignItems: 'center', gap: 3 },
  miniStatDivider: { width: 1, backgroundColor: '#E8D8DC' },
  miniStatLabel: { fontSize: 10, color: '#9E8A90', textTransform: 'uppercase', letterSpacing: 0.5 },
  miniStatVal: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: '#F0E8EA', borderRadius: 3, marginTop: 14, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressPct: { color: '#B09098', fontSize: 11, marginTop: 5 },
  latestTxText: { color: '#B09098', fontSize: 12 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, alignItems: 'center' },
  handle: { width: 40, height: 4, backgroundColor: '#E0D4D8', borderRadius: 2, marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1A0A0E', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#9E8A90', marginBottom: 20, textAlign: 'center' },

  inputLabel: { alignSelf: 'flex-start', color: '#6B5B65', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8D8DC', borderRadius: 14, paddingHorizontal: 14, width: '100%', marginBottom: 14, backgroundColor: '#FDF9FA' },
  currencySign: { fontSize: 22, color: '#6B5B65', fontWeight: '700', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: '#1A0A0E', paddingVertical: 12 },
  noteInput: { borderWidth: 1.5, borderColor: '#E8D8DC', borderRadius: 14, padding: 12, width: '100%', fontSize: 14, color: '#1A0A0E', backgroundColor: '#FDF9FA', marginBottom: 20 },

  splitTotalBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
  splitTotalTxt: { fontWeight: '700', fontSize: 15 },
  splitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 14 },
  splitFundInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  splitFundName: { fontWeight: '600', color: '#1A0A0E', fontSize: 14 },
  splitPreview: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  splitInputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 10, backgroundColor: '#FDF9FA' },
  splitInput: { fontSize: 18, fontWeight: '700', color: '#1A0A0E', width: 55, paddingVertical: 8, textAlign: 'center' },
  splitPctSign: { fontSize: 16, color: '#9E8A90', fontWeight: '600' },
  splitError: { color: '#C0394B', fontSize: 12, marginBottom: 8, textAlign: 'center' },

  fundChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#FAF7F5', gap: 3 },
  fundChipTxt: { fontSize: 11, fontWeight: '600', color: '#6B5B65' },

  confirmBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 10, backgroundColor: '#C0394B' },
  confirmBtnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { width: '100%', paddingVertical: 14, alignItems: 'center' },
  cancelBtnTxt: { color: '#9E8A90', fontSize: 15 },

  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5EDEF', gap: 12, width: '100%' },
  txNote: { color: '#1A0A0E', fontSize: 14, fontWeight: '500' },
  txDate: { color: '#B09098', fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700' },

  exportBtn: { flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 16, padding: 16 },
  exportBtnTitle: { color: '#fff', fontWeight: '700', fontSize: 15 },
  exportBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
});
