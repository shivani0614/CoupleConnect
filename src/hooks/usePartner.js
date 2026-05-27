import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { COUPLE, getPartnerName } from '../data';

export function usePartner() {
  const { profile } = useProfile();
  const { user } = useAuth();

  const myName      = profile.yourName      || user?.name          || COUPLE.name1;
  const partnerName = profile.partnerName   || getPartnerName(user?.name) || COUPLE.name2;
  const myCity      = profile.yourCity      || (user?.name === COUPLE.name2 ? COUPLE.city2 : COUPLE.city1);
  const partnerCity = profile.partnerCity   || (user?.name === COUPLE.name2 ? COUPLE.city1 : COUPLE.city2);
  const myTimezone  = profile.yourTimezone  || 'UTC-05:00 (EST)';
  const partnerTz   = profile.partnerTimezone || 'UTC+05:30 (IST)';

  return { myName, partnerName, myCity, partnerCity, myTimezone, partnerTz };
}
