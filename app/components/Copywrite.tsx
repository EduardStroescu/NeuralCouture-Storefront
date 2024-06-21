export function Copywrite() {
  return (
    <div
      className={`absolute bottom-4 left-0 pl-6 lg:pl-16 opacity-50 hover:opacity-100 pointer-events-auto`}
    >
      <a href="https://eduardstroescu.com" target="_blank" rel="noReferrer">
        &copy; {new Date().getFullYear()} / Eduard Stroescu
      </a>
    </div>
  );
}
