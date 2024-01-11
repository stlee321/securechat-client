type FeatureProps = {
  children: React.ReactNode;
};
export default function Feature({ children }: FeatureProps) {
  return (
    <div className="bg-green-2 w-64 h-72 rounded-xl flex flex-col py-8">
      {children}
    </div>
  );
}
