import Chat from "./components/Chat";
import AnimationManager from "./components/AnimationManager";
import { AppName } from "./components/AppName";

const HomePage = () => (
  <main className="relative flex h-screen flex-col overflow-hidden bg-background md:flex-row">
    <div className="absolute left-4 top-4 z-10">
      <AppName />
    </div>
    <section className="flex h-[200px] min-w-0 shrink-0 flex-col border-b border-border md:h-auto md:min-h-0 md:flex-[2] md:border-b-0 md:border-r">
      <AnimationManager />
    </section>
    <section className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-[1]">
      <Chat />
    </section>
  </main>
);

export default HomePage;
