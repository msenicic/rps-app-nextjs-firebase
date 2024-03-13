import BattleHeader from "@/components/BattleHeader";
import Footer from "@/components/Footer";
import Game from "@/components/Game";

export async function generateMetadata({params:{id}}) {
  return {title: id}
}

export default async function Post({params:{id}}) {
    return (
      <>
      <BattleHeader />
      <main>
        <Game roomId={id}/>
      </main>
      <Footer />
      </>
    );
}