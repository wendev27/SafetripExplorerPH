"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const spotSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  location: z.string().min(2),
  category: z.string().min(2),
  price: z.number().min(0),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});

type SpotInputs = z.infer<typeof spotSchema>;

export default function AdminAddSpotPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [amenitiesInput, setAmenitiesInput] = useState("");

  const { register, handleSubmit, reset } = useForm<SpotInputs>({
    resolver: zodResolver(spotSchema),
  });

  const onSubmit = async (data: SpotInputs) => {
    try {
      const amenities = amenitiesInput
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== "");

      await axios.post("/api/admin/spots", {
        ...data,
        images,
        amenities,
      });

      alert("Tourist spot added!");
      reset();
      setImages([]);
      setAmenitiesInput("");
      router.push("/admin/spots-list");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) setImages((prev) => [...prev, url]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Add Tourist Spot</h1>

        <input
          {...register("title")}
          placeholder="Title"
          className="w-full p-3 border rounded"
        />
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full p-3 border rounded"
        />
        <input
          {...register("location")}
          placeholder="Location"
          className="w-full p-3 border rounded"
        />
        <input
          {...register("category")}
          placeholder="Category"
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          placeholder="Price"
          className="w-full p-3 border rounded"
        />

        {/* IMAGE UPLOADER */}
        <div>
          <button
            type="button"
            onClick={addImage}
            className="mb-2 bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            Add Image URL
          </button>
          <ul className="list-disc pl-5">
            {images.map((img, i) => (
              <li key={i}>{img}</li>
            ))}
          </ul>
        </div>

        {/* AMENITIES */}
        <input
          value={amenitiesInput}
          onChange={(e) => setAmenitiesInput(e.target.value)}
          placeholder="Amenities (comma separated)"
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Add Spot
        </button>
      </form>
    </div>
  );
}
