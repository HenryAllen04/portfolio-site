import Clock from "./Clock";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div>
        <div></div>
        <div className="footer-right">
          <span>{currentYear}</span>
          <Clock />
        </div>
      </div>
    </footer>
  );
}