import EmojiReactions from "./components/EmojiReactions";

const App = ({
  channelName,
  clientId,
}: {
  channelName: string;
  clientId: string;
}) => {
  return <EmojiReactions clientId={clientId} channelName={channelName} />;
};

export default App;
