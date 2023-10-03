interface EmojiUsage {
  emoji: string;
  usedBy: string[];
}
interface Message {
  author?: string;
  content?: string;
  timeserial?: string;
  reactions?: EmojiUsage[];
  timeStamp?: Date;
}

const defaultMessages: Message[] = [
  {
    author: "Charles Lovelace",
    content:
      "There are only 10 kinds of people in this world: those who know binary and those who don't.",
  },
  {
    author: "Andries IJsak",
    content:
      "Why do we tell actors to “break a leg?” Because every play has a cast",
  },
  {
    author: "Shaili Potrick",
    content: "Hello, hope you are having a great time?",
  },
  {
    author: "Riley Harris",
    content:
      "Tried to come up with a carpentry pun that woodwork... Think I nailed it",
  },
  {
    author: "John Doe",
    content:
      "Fun fact: It's illegal to own just one guinea pig in Switzerland. It's considered animal abuse because they're social beings and get lonely.",
  },
  {
    author: "Donata Curro",
    content:
      "Some trees are committed to one romantic relationship at a time. They practice mahogany.",
  },
  {
    author: "Acilia Simoni",
    content:
      "Today my doctor told me I was color blind. That really came out of the purple.",
  },
  {
    author: "Zainab Sabri",
    content:
      "You know what charm is: a way of getting the answer yes without having asked any clear question.",
  },
  {
    author: "Will Lloyd",
    content:
      "Did you hear about the mathematician who is afraid of negative numbers? He will stop at nothing to avoid them.",
  },
  {
    author: "Alfie Moss",
    content:
      "You don't need a parachute to go skydiving. You need a parachute to go skydiving twice.",
  },
];

export default defaultMessages;
export type { Message, EmojiUsage };
