export default function Agrupamento({ children }) {
  return (
    <div className="p-6 m-6 overflow-x-auto border desktop1:w-fit border-border rounded-xl">
      {children}
    </div>
  );
}
