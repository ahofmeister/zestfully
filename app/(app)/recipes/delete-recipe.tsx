"use client";
import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/app/(app)/recipes/recipe-actions";
import { Button } from "@/components/ui/button";

const DeleteRecipe = (props: { id: string }) => {
	const router = useRouter();
	return (
		<Button
			variant="destructive"
			size={"sm"}
			onClick={() => {
				void deleteRecipe(props.id);
				router.push("/recipes");
			}}
		>
			Delete
		</Button>
	);
};

export default DeleteRecipe;
