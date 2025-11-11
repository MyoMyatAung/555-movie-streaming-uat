const DividerStroke = ({ height = "12" }: { height?: string }) => {
  return (
    <div
      className={`w-[0.5px] bg-white/60`}
      style={{ height: `${height}px` }}
    ></div>
  );
};

export default DividerStroke;
