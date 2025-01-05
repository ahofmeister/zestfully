import { useRouter, useSearchParams } from "next/navigation";

type UpdateParam = { key: string; value: string | undefined };

const useUpdateQueryParams = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    return (updates: UpdateParam | UpdateParam[]) => {
        const currentParams = new URLSearchParams(searchParams.toString());

        const updateArray = Array.isArray(updates) ? updates : [updates];

        updateArray.forEach(({ key, value }) => {
            if (value) {
                currentParams.set(key, value);
            } else {
                currentParams.delete(key);
            }
        });

        router.replace(`?${currentParams.toString()}`);
    };
};

export default useUpdateQueryParams;
