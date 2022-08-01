interface EmojiUsage {
  emoji: string
  usedBy: string[]
}
interface Message {
  author?: string
  content?: string
  timeserial?: string
  reactions?: EmojiUsage[]
}

const defaultMessages: Message[] = [
  {
    author: 'Charles Lovelace',
    content:
      "There are only 10 kinds of people in this world: those who know binary and those who don't.",
  },
  {
    author: 'Sony Pictures',
    content:
      'Why do we tell actors to “break a leg?” Because every play has a cast',
  },
  {
    author: 'Charles Lovelace',
    content: 'Hello, hope you are having a great time?',
  },
  {
    author: 'Oak Tree',
    content:
      'Tried to come up with a carpentry pun that woodwork... Think I nailed it',
  },
  {
    author: 'John Doe',
    content:
      "Fun fact: It's illegal to own just one guinea pig in Switzerland. It's considered animal abuse because they're social beings and get lonely.",
  },
]

export default defaultMessages
export type { Message, EmojiUsage }
