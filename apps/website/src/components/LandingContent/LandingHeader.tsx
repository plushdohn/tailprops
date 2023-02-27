type Props = {
  children: React.ReactNode;
};

export function LandingHeader(props: Props) {
  return (
    <h6
      tw="text-3xl font-black leading-tight m-0"
      tw-sm="text-6xl leading-none"
    >
      {props.children}
    </h6>
  );
}
