'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { deleteLink, getLinks } from "./action";

export default function Home() {
  const [links, setLinks] = useState(null);
  const [isPending, startTransition] = useTransition();

  const fetchData = async () => {
      const data = await getLinks();
      setLinks(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteLink(id).then(result => {
        if (result?.message) {
          console.log(result.message);
          fetchData();
        }
      });
    });
  };

  if (!links) {
        return <div>Loading...</div>
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Hello👋</h1>
          <p>This is an area to create your links, so let's put them here!</p>
        </div>
        <div className="flex justify-end">
          <Link href='/create'>
            <Button>Add Link</Button>
          </Link>
        </div>
        {links?.map(
          (link: { id: number; title: string; url: string }) => (
            <Card key={link.id}>
              <CardContent className="flex justify-between items-center">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="truncate max-w-[200px] sm:max-w-xs md:max-w-md hover:underline">
                  {link.title}
                </a>
                <div className="flex gap-2">
                  <Link href={`/edit/${link.id}`}>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </Link>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p>Are you sure you want to delete this data?</p>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(link.id.toString())}
                          disabled={isPending}
                          className={cn(
                            isPending && "opacity-70 cursor-not-allowed",
                          )}
                        >
                          {isPending ? 'Deleting...' : 'Yes'}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          ),
        )}        
      </div>
    </>
  );
}

