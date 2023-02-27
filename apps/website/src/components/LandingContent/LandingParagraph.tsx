type Props = {
  children: React.ReactNode;
  className?: string;
  sl?: string;
};

export function LandingParagraph(props: Props) {
  return (
    <p tw="text-gray-300 text-center" className={props.className}>
      {props.children}
    </p>
  );
}
