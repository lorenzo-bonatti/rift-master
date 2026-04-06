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
        queryFn: async () => await supabase.from("set").select("id, label, order").order("order", { ascending: true }),
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
                        <div className="grid grid-cols-3 gap-2">
                            {domains?.map((domain) => (
                                <Chip
                                    key={domain.id}
                                    variant="flat"
                                    color={field.state.value.includes(domain.id) ? "primary" : "default"}
                                    startContent={
                                        <img
                                            src={`/domains/${domain.code.toLocaleLowerCase()}.png`}
                                            alt={domain.code}
                                            className="w-5 h-5 object-cover"
                                        />
                                    }
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, domain.id));
                                        void form.handleSubmit();
                                    }}
                                    className="max-w-full pl-2"
                                >
                                    {domain.code}
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
                        <div className="grid grid-cols-2 gap-2">
                            {sets?.map((set) => (
                                <Chip
                                    key={set.id}
                                    variant="flat"
                                    color={field.state.value.includes(set.id) ? "primary" : "default"}
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, set.id));
                                        void form.handleSubmit();
                                    }}
                                    className="max-w-full pl-2"
                                >
                                    {set.label}
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
                        <div className="grid grid-cols-3 grid-flow-row-dense gap-1">
                            {rarities?.map((rarity) => (
                                <Chip
                                    key={rarity.id}
                                    variant="flat"
                                    color={field.state.value.includes(rarity.id) ? "primary" : "default"}
                                    startContent={
                                        <img
                                            src={`/rarities/${rarity.code.toLocaleLowerCase()}.png`}
                                            alt={rarity.code}
                                            className="w-4 h-4 object-cover"
                                        />
                                    }
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, rarity.id));
                                        void form.handleSubmit();
                                    }}
                                    className="max-w-full pl-2"
                                >
                                    {rarity.code}
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
                        <div className="grid grid-cols-3 grid-flow-row-dense gap-1">
                            {types?.map((type) => (
                                <Chip
                                    key={type.id}
                                    variant="flat"
                                    color={field.state.value.includes(type.id) ? "primary" : "default"}
                                    onClick={() => {
                                        field.handleChange(toggleValueInArray(field.state.value, type.id));
                                        void form.handleSubmit();
                                    }}
                                    className="max-w-full pl-2"
                                >
                                    {type.code}
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
