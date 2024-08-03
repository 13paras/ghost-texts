export default function WorkButton() {
  return (
    <button
      type="button"
      className="group relative overflow-hidden rounded-full bg-purple-700 px-10 py-2 text-lg transition-all"
    >
      <span className="absolute bottom-0 left-0 h-48 w-full origin-bottom translate-y-full transform overflow-hidden rounded-full bg-white/15 transition-all duration-300 ease-out group-hover:translate-y-14"></span>
      <span className="font-semibold text-purple-200">Login</span>
    </button>
  );
}
