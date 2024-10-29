import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  category: string;
  instructor: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  price,
  category,
  instructor
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-lg transition overflow-hidden border rounded-lg p-3">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-blue-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">
            By {instructor}
          </p>
          <div className="my-3 flex items-center gap-x-2">
            <div className="text-sm text-slate-700 bg-slate-100 rounded-full px-2 py-1">
              {category}
            </div>
          </div>
          <p className="text-md md:text-sm font-medium text-slate-700">
            ${price}
          </p>
        </div>
      </div>
    </Link>
  );
}; 