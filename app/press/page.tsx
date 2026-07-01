import { PressShowcase } from "@/components/PressShowcase";

export const metadata = {
  title: "Press | Janet Lee Design Studio"
};

export default function PressPage() {
  return (
    <main className="press-page">
      <PressShowcase />

      <section className="projects-partners press-partners" aria-labelledby="press-partners-title">
        <div className="press-partners__mark" aria-hidden="true" />
        <h2 id="press-partners-title">OUR PARTNERS</h2>
        <div className="projects-partners__logos">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="projects-partners__logo" key={index}>
              <span>LOGO</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
