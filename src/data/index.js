// src/data/index.js

export const COUPLE = {
  name1:        'Alex',
  name2:        'Jordan',
  city1:        'New York, NY',
  city2:        'Miami, FL',
  marriedSince: new Date('2018-06-03'),
  distanceKm:   1247,
  distanceMi:   775,
  flightHours:  3,
  timeDiff:     'Same timezone',
  nextVisit:    new Date('2025-06-01'),
  streakDays:   31,
};

export const QUESTIONS = [
  "What's one thing I did this week that made you feel loved without realising it?",
  "If we could relive one day from our marriage, which would you pick?",
  "What small habit of mine do you secretly adore?",
  "How do you want to celebrate our next anniversary?",
  "What does 'home' mean to you when we're apart?",
  "When did you first know I was the one?",
  "What's one dream you want us to make real this year?",
  "Describe our perfect Sunday in three words.",
  "What's something new you'd love for us to try together?",
  "What are you most grateful for about us today?",
  "What's a memory that always makes you smile?",
  "If you could send me anything right now, what would it be?",
];

export const ACTIVITIES = [
  { id: '1', icon: '💑', name: 'Couple Quiz',    desc: 'How well do you know me?',   color: '#FBEAEC' },
  { id: '2', icon: '🎬', name: 'Movie Night',    desc: 'Sync & watch together',       color: '#EAD6FF' },
  { id: '3', icon: '👨‍🍳', name: 'Cook Together', desc: 'Same recipe, video call',     color: '#FFE8D1' },
  { id: '4', icon: '📋', name: 'Bucket List',    desc: 'Plan dreams together',        color: '#D6EAFF' },
  { id: '5', icon: '🎮', name: 'Game Night',     desc: 'Play online together',        color: '#D6F5E3' },
  { id: '6', icon: '✉️', name: 'Love Letters',   desc: 'Write to each other',         color: '#FFF9C4' },
];

export const INIT_TASKS = [
  { id: '1', text: 'Book anniversary dinner',  who: 'Alex',   done: true  },
  { id: '2', text: 'Renew car insurance',       who: 'Jordan', done: false },
  { id: '3', text: 'Order anniversary gift',    who: 'Both',   done: false },
  { id: '4', text: 'Pay electric bill',         who: 'Alex',   done: true  },
  { id: '5', text: 'Plan June trip',            who: 'Jordan', done: false },
];

export const INIT_MESSAGES = [
  { id: '1', me: false, text: 'Good morning love 💍 thinking of you',                  ts: '8:14 AM' },
  { id: '2', me: true,  text: 'Good morning! Already counting down to June 1st 🥰',    ts: '8:22 AM' },
  { id: '3', me: false, text: 'I booked our anniversary restaurant! 🍷',               ts: '8:45 AM' },
  { id: '4', me: true,  text: "You're the best. I love you so much 💑",               ts: '8:47 AM' },
];

export const INIT_NOTES = [
  { id: '1', from: 'Alex',   text: 'I fell in love all over again watching you laugh on our last call 🌻', colorIdx: 0 },
  { id: '2', from: 'Jordan', text: 'You make every hard day easier just by existing 💕',                    colorIdx: 1 },
  { id: '3', from: 'Alex',   text: "Can't wait to hold your hand again 🤞",                                 colorIdx: 2 },
  { id: '4', from: 'Jordan', text: 'Home is wherever you are 🏡',                                           colorIdx: 3 },
];

export const SPECIAL_DATES = [
  { id: '1', icon: '💍', name: '6th Wedding Anniversary', when: 'June 3rd · 16 days',  note: 'Traditional gift: Candy' },
  { id: '2', icon: '🎂', name: "Jordan's Birthday",        when: 'July 18th · 61 days', note: 'Plan a surprise!' },
  { id: '3', icon: '✈️', name: 'Visit Weekend',            when: 'June 1st · 14 days',  note: 'Next meet-up ✓' },
];

export const DATE_IDEAS = [
  { id: '1', icon: '🕯️', name: 'Virtual Dinner',  desc: 'Dress up, eat together'   },
  { id: '2', icon: '⭐',  name: 'Stargazing',       desc: 'Same sky, video call'     },
  { id: '3', icon: '🎮',  name: 'Game Night',       desc: 'Play online together'     },
  { id: '4', icon: '💌',  name: 'Love Letters',     desc: 'Write to each other'      },
];

export const GIFT_OPTIONS = [
  {
    id: '1',
    title: 'Custom Name Necklace',
    desc: 'Engraved with your partner’s name for a sentimental anniversary gift.',
    site: 'Etsy',
    discount: '15% off',
    personalized: true,
    url: 'https://www.etsy.com/c/jewelry-and-accessories/personalized-gifts',
  },
  {
    id: '2',
    title: 'Personalized Star Map',
    desc: 'Show your special date in the stars with a custom framed print.',
    site: 'Uncommon Goods',
    discount: '10% sitewide',
    personalized: true,
    url: 'https://www.uncommongoods.com/personalized-maps',
  },
  {
    id: '3',
    title: 'Luxury Candle Set',
    desc: 'A scented candle gift bundle for cozy nights in.',
    site: 'Amazon',
    discount: '20% off',
    personalized: false,
    url: 'https://www.amazon.com/s?k=luxury+candle+gift+set',
  },
  {
    id: '4',
    title: 'Custom Couples Portrait',
    desc: 'A hand-drawn portrait of the two of you from a favorite photo.',
    site: 'Not on the High Street',
    discount: '12% off',
    personalized: true,
    url: 'https://www.notonthehighstreet.com/gifts/personalised-gifts',
  },
];

export const AUTO_REPLIES = [
  '💍 I love you so much!',
  '😍 You always know what to say',
  'Miss you baby 🥺',
  "Can't wait to hold you ❤️",
  "You're my favourite person 💑",
  'Every day with you is a gift 🌸',
  'Sending you the biggest hug 🤗',
  'You make me so happy ✨',
];
