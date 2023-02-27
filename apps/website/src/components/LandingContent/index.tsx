type Props = {
  children: React.ReactNode;
  id: string;
};

export function LandingContent(props: Props) {
  return (
    <div
      tw="relative h-screen flex flex-col justify-center items-center gap-4 text-center"
      id={props.id}
    >
      {props.children}
    </div>
  );
}
