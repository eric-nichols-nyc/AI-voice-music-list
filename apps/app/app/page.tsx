import Chat from "./components/Chat";
import AnimationManager from "./components/AnimationManager";

const HomePage = () => (
  <main className="flex min-h-screen bg-background">
    <section className="flex-[2] min-w-0 border-r border-border">
          <AnimationManager />
    </section>
    <section className="flex-[1] min-w-0">
        <Chat />
    </section>
  </main>
);

export default HomePage;
