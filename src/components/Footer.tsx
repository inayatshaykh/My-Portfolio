const Footer = () => (
  <footer className="border-t border-border py-10 bg-secondary/20">
    <div className="container mx-auto px-4 text-center">
      <a href="#home" className="text-xl font-display font-bold text-gradient-gold">DevCraft</a>
      <p className="text-muted-foreground text-xs font-body mt-2">
        Premium Website Development in Delhi, India
      </p>
      <p className="text-muted-foreground text-xs font-body mt-4">
        © {new Date().getFullYear()} DevCraft. All rights reserved.
      </p>
      <a href="/admin" className="text-muted-foreground/40 text-xs font-body mt-3 inline-block hover:text-muted-foreground transition-colors">
        Admin
      </a>
    </div>
  </footer>
);

export default Footer;
