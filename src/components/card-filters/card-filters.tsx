/**
 * Filtri per le carte
 * - set
 * - rarity
 * - domain
 * - type (champion, gear, spell, legend)
 * - metadata (alternative, outnumber, etc.)
 * - my collection
 */

import { Chip } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../integration/supabase";

interface IProps {
    onSubmit: (filters: { domains: number[]; sets: number[]; rarities: number[] }) => void;
}

export const CardFilters = ({ onSubmit }: IProps) => {
    const { data: sets } = useQuery({
        queryKey: ["sets"],
        queryFn: async () => await supabase.from("set").select("id, name, riftbound_id"),
        select: (res) => res.data ?? [],
    });

    const { data: domains } = useQuery({
        queryKey: ["domains"],
        queryFn: async () => await supabase.from("domain").select("id, code"),
        select: (res) => res.data ?? [],
    });

    const { data: rarities } = useQuery({
        queryKey: ["rarities"],
        queryFn: async () => await supabase.from("rarity").select("id, code"),
        select: (res) => res.data ?? [],
    });

    const form = useForm({
        defaultValues: {
            domains: [] as number[],
            sets: [] as number[],
            rarities: [] as number[],
        },
        onSubmit: ({ value }) => onSubmit(value),
    });

    const { Field } = form;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {/* Domains */}
            <Field name="domains">
                {(field) => (
                    <div>
                        <h3>Domains</h3>
                        <div className="flex flex-wrap gap-2">
                            {domains?.map((set) => (
                                <Chip
                                    key={set.id}
                                    variant="flat"
                                    color={field.state.value.includes(set.id) ? "primary" : "default"}
                                    startContent={
                                        <img
                                            src={`/domains/${set.code.toLocaleLowerCase()}.png`}
                                            alt={set.code}
                                            className="w-6 h-6 object-cover"
                                        />
                                    }
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, set.id));
                                        void form.handleSubmit();
                                    }}
                                >
                                    {set.code}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}
            </Field>
            {/* Sets */}
            <Field name="sets">
                {(field) => (
                    <div>
                        <h3>Sets</h3>
                        <div className="flex gap-2">
                            {sets?.map((set) => (
                                <Chip
                                    key={set.id}
                                    variant="flat"
                                    color={field.state.value.includes(set.id) ? "primary" : "default"}
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, set.id));
                                        void form.handleSubmit();
                                    }}
                                >
                                    {set.name}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}
            </Field>
            {/* Rarities */}
            <Field name="rarities">
                {(field) => (
                    <div>
                        <h3>Rarity</h3>
                        <div className="flex gap-2">
                            {rarities?.map((set) => (
                                <Chip
                                    key={set.id}
                                    variant="flat"
                                    color={field.state.value.includes(set.id) ? "primary" : "default"}
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, set.id));
                                        void form.handleSubmit();
                                    }}
                                >
                                    {set.code}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}
            </Field>
        </form>
    );
};

// Function to toggle a value in an array
const toggleValueInArray = (array: number[], value: number) => {
    if (array.includes(value)) return array.filter((v) => v !== value);
    return [...array, value];
};
