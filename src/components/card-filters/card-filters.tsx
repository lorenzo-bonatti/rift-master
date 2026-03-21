/**
 * Filtri per le carte
 * - set
 * - rarity
 * - domain
 * - type (champion, gear, spell, legend)
 * - metadata (alternative, outnumber, etc.)
 * - my collection
 */

import { Button, Chip } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../integration/supabase";

interface IValue {
    domains: number[];
    sets: number[];
    rarities: number[];
    types: number[];
}

interface IProps {
    values: IValue;
    onSubmit: (filters: IValue) => void;
}

export const CardFilters = ({ values, onSubmit }: IProps) => {
    const { data: sets } = useQuery({
        queryKey: ["sets"],
        queryFn: async () => await supabase.from("set").select("id, name, order").order("order", { ascending: true }),
        select: (res) => res.data ?? [],
    });

    const { data: domains } = useQuery({
        queryKey: ["domains"],
        queryFn: async () =>
            await supabase.from("domain").select("id, code, order").order("order", { ascending: true }),
        select: (res) => res.data ?? [],
    });

    const { data: rarities } = useQuery({
        queryKey: ["rarities"],
        queryFn: async () =>
            await supabase.from("rarity").select("id, code, order").order("order", { ascending: true }),
        select: (res) => res.data ?? [],
    });

    const { data: types } = useQuery({
        queryKey: ["types"],
        queryFn: async () => await supabase.from("type").select("id, code, order").order("order", { ascending: true }),
        select: (res) => res.data ?? [],
    });

    const form = useForm({
        defaultValues: values,
        onSubmit: ({ value }) => onSubmit(value),
    });

    const { Field, Subscribe } = form;

    const handleClearFilters = () => {
        form.setFieldValue("sets", []);
        form.setFieldValue("rarities", []);
        form.setFieldValue("types", []);
        form.setFieldValue("domains", []);
        void form.handleSubmit();
    };

    return (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {/* Domains */}
            <Field name="domains">
                {(field) => (
                    <div>
                        <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Domains</h3>
                        <div className="flex flex-wrap gap-1">
                            {domains?.map((set) => (
                                <Chip
                                    key={set.id}
                                    variant="flat"
                                    color={field.state.value.includes(set.id) ? "primary" : "default"}
                                    startContent={
                                        <img
                                            src={`/domains/${set.code.toLocaleLowerCase()}.png`}
                                            alt={set.code}
                                            className="w-5 h-5 object-cover"
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
                        <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Sets</h3>
                        <div className="flex flex-wrap grid-flow-row-dense gap-1">
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
                        <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Rarity</h3>
                        <div className="flex flex-wrap grid-flow-row-dense gap-1">
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
            {/* Types */}
            <Field name="types">
                {(field) => (
                    <div>
                        <h3 className="text-sm font-gray-500 font-semibold uppercase px-1 mb-2">Type</h3>
                        <div className="flex flex-wrap grid-flow-row-dense gap-1">
                            {types?.map((set) => (
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

            <Subscribe
                selector={({ values }) => {
                    const hasFilters = Object.values(values).some((arr) => arr.length > 0);
                    return !hasFilters;
                }}
            >
                {(disabled) => (
                    <Button
                        color="primary"
                        isDisabled={disabled}
                        startContent={<i className="fa-solid fa-xmark" />}
                        className="w-full"
                        onPress={handleClearFilters}
                    >
                        Clear filters
                    </Button>
                )}
            </Subscribe>
        </form>
    );
};

// Function to toggle a value in an array
const toggleValueInArray = (array: number[], value: number) => {
    if (array.includes(value)) return array.filter((v) => v !== value);
    return [...array, value];
};
