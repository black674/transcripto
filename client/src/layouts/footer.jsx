import { Link } from "react-router-dom";

export default function Footer() {
  const links = [
    {
      title: "Quick Links",
      links: [
        { href: "/", label: "Home" },
        { href: "/pricing", label: "Pricing" },
        { href: "/markdown/faq", label: "FAQ" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "markdown/terms-of-service", label: "Terms of Service" },
        { href: "markdown/privacy-policy", label: "Privacy Policy" },
        { href: "markdown/cookie-policy", label: "Cookie Policy" },
      ],
    },
  ];

  return (
    <footer className="bg-[#212121] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              YouTube Transcript Extractor
            </h3>
            <p className="text-gray-300">
              Get accurate transcripts from any YouTube video in seconds.
            </p>
          </div>
          {links.map((link) => {
            return (
              <div key={link.title}>
                <h3 className="text-lg font-semibold mb-4">{link.title}</h3>
                <ul className="space-y-2">
                  {link.links.map((link) => {
                    return <List key={link.href} {...link} />;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} YouTube Transcript Extractor. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
const List = ({ href, label }) => {
  return (
    <li key={href}>
      <Link
        to={href}
        className="text-gray-300 hover:text-white transition-colors"
      >
        {label}
      </Link>
    </li>
  );
};
