import Hero from '../components/home/Hero';
import ProductsPreview from '../components/home/ProductsPreview';
import Features from '../components/home/Features';
import FlavourShowcase from '../components/home/FlavourShowcase';
import DistributorCTA from '../components/home/DistributorCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductsPreview />
      <Features />
      <FlavourShowcase />
      <DistributorCTA />
    </>
  );
}
