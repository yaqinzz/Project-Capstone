import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import HeroSection from "../components/HeroSection";
import MainContent from "../components/MainContent";
const Dashboard = () => {
  return (
    <PageContainer withHeader={true} withFooter={true}>
      <SectionContainer className="flex min-h-[calc(100vh-144px)] w-full">
        <HeroSection />
        <MainContent />
      </SectionContainer>
    </PageContainer>
  );
};

export default Dashboard;
