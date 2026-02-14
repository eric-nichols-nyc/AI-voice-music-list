import Chat from "./components/Chat";
import AnimationManager from "./components/AnimationManager";
import { AppName } from "./components/AppName";

const HomePage = () => (
  <main className="relative flex h-screen overflow-hidden bg-background">
    <div className="absolute left-4 top-4 z-10">
      <AppName />
    </div>
    <section className="flex min-h-0 min-w-0 flex-[2] flex-col border-r border-border">
      <AnimationManager />
    </section>
    <section className="flex min-h-0 min-w-0 flex-[1] flex-col">
      <Chat />
    </section>
  </main>
);

export default HomePage;
