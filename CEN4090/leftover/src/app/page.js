import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen">
        <div className="w-full flex items-center justify-center">
        <div className="w-1/2 flex items-center justify-center flex-col gap-y-8 mt-20 mx-4">
            <h1 className="text-5xl font-bold text-primary">Do you want an easy way to find recipies with the food <span className="text-secondary">LeftOver </span>in your pantry?</h1>
            <p className="text-xl">Leftover gives our users the opportunity to digitally track all of the food they have in their pantries and find recipies that will use the food that they have. 
              We also track expiration dates and will notify you when your food is about to expire so you can cook it before it goes bad.
              Also, Chef's can post their own recipies and have them be searchable by our users. 
            </p>
            <Link href="/login">
            <button className="bg-primary hover:bg-secondary hover:text-primary text-muted font-bold py-2 px-4 rounded">
                Get Started Today!
            </button>
            </Link>
          </div>
        </div>
      <Image src="/PANTRY.jpg" width={500} height={400} className="w-1/2 h-full lg:block hidden"/>
    </div>
  );
}


