/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  points: number;
  clue: string; // The "Jeopardy Clue" (Question description)
  answer: string; // The correct answer
  options: string[]; // 4 multiple choice options including the correct answer
  explanation: string; // Dynamic fun explanation suited for 4th graders
  emoji: string; // An emoji related to this question
}

export interface Category {
  id: string;
  title: string;
  emoji: string;
  color: string; // Tailwind color theme for this category column
  questions: Question[];
}

export interface Team {
  id: string;
  name: string;
  score: number;
  emoji: string;
  color: string;
}

export interface GameState {
  mode: 'select' | 'solo_playing' | 'classroom_playing';
  teams: Team[];
  activeTeamId: string | null;
  currentCategoryIndex: number | null;
  currentQuestionIndex: number | null;
  solvedList: string[]; // list of question ids that are solved e.g. "cat_idx-question_idx"
  showingAnswer: boolean;
  scoreHistory: { [teamId: string]: number[] }; // history of scores for undos or stats
}

export const CATEGORIES_DATA: Category[] = [
  {
    id: "individuals",
    title: "Change Makers 👤",
    emoji: "👤",
    color: "from-blue-500 to-indigo-600",
    questions: [
      {
        id: "individuals-100",
        points: 100,
        clue: "He was the leader behind the UK's 'Education Act of 1944', which made high school free for ALL kids in Britain for the first time!",
        answer: "R.A. 'Rab' Butler",
        options: ["R.A. 'Rab' Butler", "Winston Churchill", "King George VI", "Neville Chamberlain"],
        explanation: "Before Mr. Butler's Education Act, high school wasn't free for everyone in Britain. He helped make sure every child could learn, regardless of how much money they had!",
        emoji: "🇬🇧"
      },
      {
        id: "individuals-200",
        points: 200,
        clue: "He wrote a super cool book called 'Education and Social Change' to help find a 'middle road' between American and British school systems.",
        answer: "Sir Fred Clarke",
        options: ["Sir Fred Clarke", "Albert Einstein", "John Dewey", "C.S. Lewis"],
        explanation: "Fred Clarke wanted school to be more equal! He didn't want the strict class structures of old Britain, but also wanted to preserve the focus on deep learning.",
        emoji: "📚"
      },
      {
        id: "individuals-300",
        points: 300,
        clue: "A refugee from Germany who started the 'Outward Bound' outdoor school in 1941 to help sailors survive and build strong minds and bodies.",
        answer: "Kurt Hahn",
        options: ["Kurt Hahn", "Robert Baden-Powell", "Sigmund Freud", "Wernher von Braun"],
        explanation: "Kurt Hahn believed in 'character building'! He wanted kids to learn teamwork, fitness, and helping others. His work helped create the famous Outward Bound school and the Duke of Edinburgh's Award!",
        emoji: "⛺"
      },
      {
        id: "individuals-400",
        points: 400,
        clue: "He lead a massive change in Japanese schools in 1945: removing war propaganda, introducing coeducation (girls & boys together), and teaching democratic values.",
        answer: "Joseph C. Trainor",
        options: ["Joseph C. Trainor", "General Douglas MacArthur", "Emperor Hirohito", "John Wayne"],
        explanation: "Joseph Trainor helped rewrite Japanese schoolbooks to promote peace, student-centered learning, and democracy instead of war and militarism!",
        emoji: "🇯🇵"
      },
      {
        id: "individuals-500",
        points: 500,
        clue: "She co-wrote 'The Social Studies Mobilize for Victory' in 1942 to help schools teach kids how to reduce prejudice and work together.",
        answer: "Hilda Taba",
        options: ["Hilda Taba", "Eleanor Roosevelt", "Jane Addams", "Helen Keller"],
        explanation: "Hilda Taba was a legendary educator who believed that social studies should teach kids to understand other cultures and stand up against bias!",
        emoji: "🤝"
      }
    ]
  },
  {
    id: "organizations",
    title: "Peace Teams 🏛️",
    emoji: "🏛️",
    color: "from-emerald-500 to-teal-600",
    questions: [
      {
        id: "organizations-100",
        points: 100,
        clue: "Starting in 1945, this world group rebuilt schools, restocked book libraries, and removed war propaganda from school books in Japan and Germany.",
        answer: "UNESCO",
        options: ["UNESCO", "The Allied Forces", "NASA", "The League of Nations"],
        explanation: "UNESCO's main motto is to build 'peace in the minds of men and women' through learning, science, and understanding culture!",
        emoji: "🕊️"
      },
      {
        id: "organizations-200",
        points: 200,
        clue: "Created in 1943, this rescue team ran schools for millions of children living inside 'Displaced Persons' (refugee) camps so they wouldn't miss out on literacy.",
        answer: "UNRRA",
        options: ["UNRRA", "The Peace Corps", "The World Health Organization", "The Salvation Army"],
        explanation: "UNRRA (United Nations Relief and Rehabilitation Administration) helped people who lost their homes in the war. They made sure children still got books and learned how to read!",
        emoji: "🎒"
      },
      {
        id: "organizations-300",
        points: 300,
        clue: "The US office that managed the GI Bill (1944), which paid for millions of war veterans to go to college or vocational schools.",
        answer: "Veterans Administration (VA)",
        options: ["Veterans Administration (VA)", "Department of Education", "The Pentagon", "National Science Foundation"],
        explanation: "The GI Bill was huge! By 1947, half of all college students in America were veterans, creating a highly skilled workforce of engineers, builders, and teachers!",
        emoji: "🎖️"
      },
      {
        id: "organizations-400",
        points: 400,
        clue: "Starting in 1946, they served warm school meals and vitamins to hungry kids in Europe and China, arguing that a healthy meal is a prerequisite to learning.",
        answer: "UNICEF",
        options: ["UNICEF", "The Food Depot", "The Red Cross", "Save the Children"],
        explanation: "UNICEF realized that hungry children can't study! By starting school lunch projects, they helped sick and malnourished kids return to their classrooms.",
        emoji: "🥛"
      },
      {
        id: "organizations-500",
        points: 500,
        clue: "During and after the war, this group sent 'School Chests' filled with pencils, crayons, and paper to students in war-ravaged countries to spread friendship.",
        answer: "The American Red Cross",
        options: ["The American Red Cross", "The Boy Scouts", "Rotary International", "YMCA"],
        explanation: "The American Red Cross sent school supplies around the world, helping kids rebuild their lives and sparking global friendships between students!",
        emoji: "❤️"
      }
    ]
  },
  {
    id: "curriculum",
    title: "School Subjects 🎯",
    emoji: "🎯",
    color: "from-amber-500 to-orange-600",
    questions: [
      {
        id: "curriculum-100",
        points: 100,
        clue: "During the war, schools stopped teaching abstract math theory. Instead, kids studied flying paths, wind speed, wind resistance, and fuel usage for airplanes!",
        answer: "Wartime Math",
        options: ["Wartime Math", "Outer Space Geometry", "Ancient Abacus Math", "Computer Coding"],
        explanation: "Mathematics became extremely hands-on! Students in 'Pre-Flight Science' calculated how heavy loads affected airplane speeds and fuel consumption.",
        emoji: "📐"
      },
      {
        id: "curriculum-200",
        points: 200,
        clue: "After the war, schools shifted history away from narrow national pride to international geography and reducing racial/ethnic bias, naming a new composite field.",
        answer: "The Rise of 'Intercultural' and Social Studies",
        options: ["The Rise of 'Intercultural' and Social Studies", "Medieval Knight History", "Strict Grammar & Spelling", "Latin Language Studies"],
        explanation: "Educators realized that teaching kids about other cultures and world geography would make them more cooperative and prevent future wars!",
        emoji: "🌍"
      },
      {
        id: "curriculum-300",
        points: 300,
        clue: "With a high demand for mechanics and builders, schools added welding, radio wiring, blueprint reading, and building skills.",
        answer: "Vocational and Technical Training",
        options: ["Vocational and Technical Training", "Fashion Modeling", "Music Conducting", "Creative Novel Writing"],
        explanation: "In order to rebuild bombed towns and maintain machinery, countries started high school 'Technical Schools' to give students hands-on career skills.",
        emoji: "⚙️"
      },
      {
        id: "curriculum-400",
        points: 400,
        clue: "Gym class changed into pre-military training with tough obstacle courses, heavy pack hikes, first aid, and survival swimming.",
        answer: "Militarized Physical Education",
        options: ["Militarized Physical Education", "Frisbee Golf & Tag", "Ballet and Jazz Dancing", "Board Game Tournaments"],
        explanation: "Both in America and Europe, physical training became mandatory with rigorous training to make sure youngsters were strong and prepared to serve or helper-out.",
        emoji: "🏃"
      },
      {
        id: "curriculum-500",
        points: 500,
        clue: "In postwar Germany and Japan, imperial textbooks had statements of hate or war literally inked out by teachers, starting a major process.",
        answer: "De-Nazification and 'New Education'",
        options: ["De-Nazification and 'New Education'", "The Ancient Reading Method", "Fairy Tale Reconstruction", "The Silent Writing Project"],
        explanation: "Teachers and students used marker pens to scribble out hateful propaganda in old packages, and Japan created a clean 'Social Studies' class to replace blind obedience lessons.",
        emoji: "✏️"
      }
    ]
  },
  {
    id: "acts",
    title: "Awesome Laws 📜",
    emoji: "📜",
    color: "from-purple-500 to-pink-600",
    questions: [
      {
        id: "acts-100",
        points: 100,
        clue: "Passed in 1944, this famous law paid for returning soldiers to study in colleges, boosting university size and classrooms everywhere.",
        answer: "The G.I. Bill",
        options: ["The G.I. Bill", "The Veterans Voting Act", "The Soldier Land Law", "The Military Honor Act"],
        explanation: "Officially called the Servicemen's Readjustment Act of 1944, this bill changed higher education forever, allowing ordinary citizens to attend college!",
        emoji: "🎓"
      },
      {
        id: "acts-200",
        points: 200,
        clue: "A massive 1946 law that started serving hot, healthy lunches to elementary and high school students to improve physical and mental focus.",
        answer: "The National School Lunch Act",
        options: ["The National School Lunch Act", "The Food Pyramid Bill", "The Candy Bar Ban", "The Milk and Cookie Act"],
        explanation: "President Harry Truman signed this act! It recognized that proper nutrition is absolutely necessary for physical growth and academic focus.",
        emoji: "🍎"
      },
      {
        id: "acts-300",
        points: 300,
        clue: "A 1958 US response to the Soviet 'Sputnik' space flight, pouring cash into high school and college math, science, and language classes.",
        answer: "The National Defense Education Act (NDEA)",
        options: ["The National Defense Education Act (NDEA)", "The Space Exploration Law", "The Rocket Booster Grant", "The Super Science Act"],
        explanation: "This law connected math/science classes directly to national exploration and defense, ensuring science laboratories got the latest microscopes and telescopes!",
        emoji: "🚀"
      },
      {
        id: "acts-400",
        points: 400,
        clue: "A major 1965 civil-rights era law that sent federal aid to support kids, teachers, and textbooks in schools serving low-income families.",
        answer: "The Elementary and Secondary Education Act",
        options: ["The Elementary and Secondary Education Act", "The Equal Homework Act", "The High School Graduation Bill", "The Free Playgrounds Rule"],
        explanation: "Part of President Lyndon B. Johnson's 'War on Poverty,' this law aimed to bridge the learning gap so every kid gets a fair, high-quality education.",
        emoji: "🏫"
      },
      {
        id: "acts-500",
        points: 500,
        clue: "Passed in 1965, this law set up federal college grants and low-interest student loans, making it possible for millions of ordinary people to afford higher education.",
        answer: "The Higher Education Act",
        options: ["The Higher Education Act", "The College Free Ride Bill", "The Student Dormitory Act", "The Professor Support Law"],
        explanation: "This bill created the Pell Grant and student loan structures, making college in the United States accessible to lower and middle-income families.",
        emoji: "🏛️"
      }
    ]
  },
  {
    id: "battles",
    title: "Key Battles ⚔️",
    emoji: "⚔️",
    color: "from-rose-500 to-red-600",
    questions: [
      {
        id: "battles-100",
        points: 100,
        clue: "This series of air raids in Britain bombed thousands of schools. This chaos drove a demand for free, high-quality school systems after the war.",
        answer: "The Blitz",
        options: ["The Blitz", "Battle of Britain", "The Fire of London", "The Normandy Landing"],
        explanation: "During the Blitz, school kids were evacuated to the country. The deep disruption inspired Butler and reformers to promise built-up, fair, and free schools for all!",
        emoji: "🇬🇧"
      },
      {
        id: "battles-200",
        points: 200,
        clue: "Soviets kept holding school classes in freezing, ruined buildings during this massive icy battle to maintain morale and prove identity.",
        answer: "Battle of Stalingrad",
        options: ["Battle of Stalingrad", "Battle of Moscow", "Battle of Berlin", "Battle of Kursk"],
        explanation: "Classes were carried on in icy basements and trenches during the Battle of Stalingrad! It proved that school was an act of psychological resistance against the invaders.",
        emoji: "❄️"
      },
      {
        id: "battles-300",
        points: 300,
        clue: "This surprise attack instantly turned American college campuses into strict military training hubs and made courses turn patriotic and STEM-centered.",
        answer: "Pearl Harbor",
        options: ["Pearl Harbor", "D-Day Landings", "Battle of Midway", "The Chicago Fire"],
        explanation: "After Pearl Harbor, colleges taught survival mapping, navigation, and Morse code. Liberal arts took a backseat as science, physical stamina, and math ruled!",
        emoji: "⚓"
      },
      {
        id: "battles-400",
        points: 400,
        clue: "An 872-day siege where starving Soviet students and heroic teachers held classes to prove educational institutions were vital for national survival.",
        answer: "Siege of Leningrad",
        options: ["Siege of Leningrad", "Siege of Sevastopol", "Battle of Warsaw", "Siege of Moscow"],
        explanation: "Even with no heat and extreme starvation, school exams and bells rang in Leningrad, showing that books were a powerful weapon of spiritual resistance!",
        emoji: "🥖"
      },
      {
        id: "battles-500",
        points: 500,
        clue: "This intense city fight destroyed the Philippine capital's 'educational district', leading to a massive postwar rebuild using Americanized public school models.",
        answer: "Battle of Manila",
        options: ["Battle of Manila", "Battle of Corregidor", "Battle of Leyte Gulf", "The Bataan Escape"],
        explanation: "The historic libraries, colleges, and schools of Manila were ruined. Postwar, the Philippine government worked with international groups to establish a highly accessible public school model.",
        emoji: "🇵🇭"
      }
    ]
  }
];

export const FUN_EMOJIS_CORRECT = ["🎉", "⭐", "🏆", "🌟", "✨", "🔥", "🎈", "🥳", "🙌", "🦸", "🎓"];

// Synthesizer with AudioContext for sound effects
class SoundFXManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Create cute retro-arcade double tone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Star sound - sweet third interval C5 (523Hz) up to E5 (659Hz) then G5 (784Hz)
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
      
      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.20);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn("AudioContext block / failed to trigger", e);
    }
  }

  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft non-punishing "try again" sound: nice warm chord decaying down
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(293.66, now); // D4
      osc.frequency.linearRampToValueAtTime(220.00, now + 0.25); // A3

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn("AudioContext block / failed to trigger", e);
    }
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn("AudioContext block", e);
    }
  }

  playWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Trophy win melody!
      const tones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      tones.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.24);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    } catch (e) {
      console.warn("AudioContext block", e);
    }
  }
}

export const soundFX = new SoundFXManager();
