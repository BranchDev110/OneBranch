import { Sprint } from "@/types/sprint.types";
import { matchSorter } from "match-sorter";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { useSetActiveSprintForProjectMutation } from "@/services/projects";
import { SetActiveSprintForProjectArgs } from "@/types/project.types";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

interface Props {
  closeModal?: (val: boolean) => void;
  activeSprintId: string;
  sprints: Sprint[];
  projectId: string;
  disabled: boolean;
}

const SetProjectActiveSprintModal = ({
  closeModal,
  projectId,
  sprints = [],
  activeSprintId,
  disabled,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sprintId, setSprintId] = useState(activeSprintId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const [setActiveSprint, res] = useSetActiveSprintForProjectMutation();

  const handleOpenChange = (val: boolean) => {
    setOpen(val);

    if (!val) {
      closeModal && closeModal(false);
    }
  };

  const handleSubmit = async () => {
    toast.dismiss();
    try {
      if (activeSprintId === sprintId) {
        setSprintId("");
        handleOpenChange(false);
        setQuery("");
        return;
      }

      if (!sprintId) {
        throw new Error("Please select a sprint");
      }

      const id = toast.loading("Updating active sprint");
      const body: SetActiveSprintForProjectArgs = { sprintId, projectId };

      //   console.log({ body });

      await setActiveSprint(body).unwrap();

      toast.dismiss(id);
      toast.dismiss();
      handleOpenChange(false);
    } catch (error: any) {
      toast.dismiss();

      const msg = error?.message || "Unable to set active sprint";
      toast.error(msg);
    }
  };

  const data = useMemo(() => {
    let filteredSprints = sprints;

    if (query?.trim()) {
      filteredSprints = matchSorter(sprints, query, {
        keys: ["name"],
        threshold: matchSorter.rankings.CONTAINS,
      });
    }

    return filteredSprints;
  }, [query, sprints]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger disabled={disabled} asChild>
        <Button
          variant={"ghost"}
          className="block w-full pl-2 font-normal text-start h-unset"
        >
          <span>Set Active Sprint</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl pt-12 px-8 h-[70vh]">
        <ScrollArea className="h-full">
          <h1 className="my-3 text-3xl font-bold text-center">
            Update active sprint
          </h1>

          <div className="space-y-6">
            <div className="px-2 end">
              <div className="relative my-3 basis-2/3">
                <i className="absolute -translate-y-1/2 left-2 top-1/2">
                  <MagnifyingGlassIcon />
                </i>
                <Input
                  value={query}
                  onChange={handleChange}
                  placeholder="Search sprints...."
                  className="block w-full pl-7 bg-c5-50 rounded-xl"
                  type="search"
                />
              </div>
            </div>

            <div className="space-y-1">
              <RadioGroup value={sprintId} onValueChange={setSprintId}>
                {data.map((s) => (
                  <div key={s.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={s.id} id={s.id} />
                    <Label htmlFor={s.id}>{s.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSubmit}
                disabled={res.isLoading}
                className={cn("", {
                  "animate-pulse cursor-not-allowed": res.isLoading,
                })}
              >
                Submit
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SetProjectActiveSprintModal;
