import { useState, useEffect } from "react";
/* Let's us have temporary local state for an object loaded from the
   server.
*/
export const useWorkingCopy = <T>(
    retriever: () => T | null,
    dependencies: unknown[]
) => {

    const [workingCopy, setWorkingCopy] = useState<T | null>(retriever());
    useEffect(() => {
        setWorkingCopy(
            structuredClone(retriever()));
    }, dependencies);

    return { workingCopy, setWorkingCopy };
};