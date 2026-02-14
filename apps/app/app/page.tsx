import Chat from "./components/Chat";
import AnimationManager from "./components/AnimationManager";

const HomePage = () => (
  <main className="flex h-screen overflow-hidden bg-background">
    <section className="flex h-full min-h-0 flex-[2] border-r border-border">
      <AnimationManager />
    </section>
    <section className="flex h-full min-h-0 flex-[1] flex-col">
      <Chat />
    </section>
  </main>
);

export default HomePage;
