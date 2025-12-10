"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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

function AdminEditSpotPage() {
  const router = useRouter();
  const { id } = useParams();
  const [images, setImages] = useState<string[]>([]);
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<SpotInputs>({
    resolver: zodResolver(spotSchema),
  });

  useEffect(() => {
    if (!id) return;

    // Fetch existing spot data
    fetch(`/api/admin/spots/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const spot = data.data;
          setValue("title", spot.title);
          setValue("description", spot.description);
          setValue("location", spot.location);
          setValue("category", spot.category);
          setValue("price", spot.price);
          setImages(spot.images || []);
          setAmenitiesInput((spot.amenities || []).join(", "));
        }
      })
      .catch((error) => {
        console.error("Error fetching spot:", error);
        alert("Failed to load spot data");
      })
      .finally(() => setLoading(false));
  }, [id, setValue]);

  const onSubmit = async (data: SpotInputs) => {
    setSaving(true);
    try {
      const amenities = amenitiesInput
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a !== "");

      const response = await axios.put(`/api/admin/spots/${id}`, {
        ...data,
        images,
        amenities,
      });

      if (response.data.success) {
        alert("Tourist spot updated successfully!");
        router.push("/features/dashboard/admin");
      } else {
        alert("Failed to update spot");
      }
    } catch (error) {
      console.error("Error updating spot:", error);
      alert("Failed to update spot");
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-6">Loading spot data...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Tourist Spot</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            {...register("title")}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full p-3 border rounded-lg"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              {...register("location")}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              {...register("category")}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₱)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <div className="space-y-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Image
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Amenities (comma-separated)
          </label>
          <input
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="WiFi, Parking, Restaurant..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Spot"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Explicit default export to satisfy Next.js page expectations
export default AdminEditSpotPage;
