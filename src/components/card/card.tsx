import { Card } from "@/src/models/card.model";

// Assuming CardProps is defined to include the types for the props
interface CardProps {
  cards: Card[] | null;
  loading: boolean;
}

// Adjust the function signature to accept props
export default function CardComponent({ cards, loading }: CardProps) {
  return (
    <div>
      {loading ? (
        <div className="container mx-auto flex items-center justify-center h-screen w-1/3">
          <div className="container mx-auto flex flex-col gap-4 text-center justify-centerbg-white shadow-sm ">
            <div>Loading...</div>
          </div>
        </div>
      ) : (
        <ul>
          {cards?.map((card) => (
            <li key={card.id}>{card.Title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
