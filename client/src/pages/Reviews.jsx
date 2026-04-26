import { Star, MessageSquare } from 'lucide-react';

const Reviews = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-8">Guest Reviews</h1>

      <div className="bg-white p-12 rounded-[40px] border shadow-sm text-center">
        <div className="bg-primary/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No reviews yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          When guests complete their stay, their feedback and ratings will appear here for you to manage.
        </p>
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-6 w-6 text-gray-200 fill-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Reviews;
