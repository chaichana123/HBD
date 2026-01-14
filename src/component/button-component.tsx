type ButtonProps = {
    label: string;
  };
  
  export default function MyButton({ label }: ButtonProps) {
    return <button>{label}</button>;
  }