import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SearchableSelect } from "./SearchableSelect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Example 1: Basic usage with static data
export const BasicExample = () => {
  const users = [
    {
      value: "user1",
      label: "John Doe",
      avatar: "https://example.com/avatar1.jpg",
    },
    {
      value: "user2",
      label: "Jane Smith",
      avatar: "https://example.com/avatar2.jpg",
    },
    {
      value: "user3",
      label: "Robert Johnson",
      avatar: "https://example.com/avatar3.jpg",
      disabled: true,
    },
    {
      value: "user4",
      label: "Emily Davis",
      avatar: "https://example.com/avatar4.jpg",
    },
  ];

  const [selectedUser, setSelectedUser] = useState<string | null>("user1");

  return (
    <div className="w-full max-w-md p-4">
      <h2 className="text-lg font-bold mb-4">Basic Static Example</h2>
      <SearchableSelect
        name="user"
        // label="Select User"
        items={users}
        // value={selectedUser}
        // onChange={setSelectedUser}
        // renderItem={(item) => (
        //   <div className="flex items-center gap-2">
        //     <div className="w-6 h-6 rounded-full bg-gray-200" />
        //     <span>{item.label}</span>
        //   </div>
        // )}
      />
    </div>
  );
};

// Example 2: With API and debounce search
export const ApiSearchExample = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Mock API call - in real app, this would be your API call
  const searchUsers = async (query: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockApiResponse = [
      { value: "u1", label: `John (matching "${query}")` },
      { value: "u2", label: `Jane (matching "${query}")` },
      { value: "u3", label: `Sam (matching "${query}")` },
    ];

    setLoading(false);
    return mockApiResponse;
  };

  return (
    <div className="w-full max-w-md p-4">
      <h2 className="text-lg font-bold mb-4">
        API Search Example with Debounce
      </h2>
      <SearchableSelect
        name="apiUser"
        // label="Search Users"
        onSearch={searchUsers}
        loading={loading}
        // value={selectedUser}
        onChange={setSelectedUser}
        debounceMs={500}
        placeholder="Search for a user..."
        searchPlaceholder="Type to search users..."
      />
    </div>
  );
};

// Example 3: With React Hook Form
export const FormExample = () => {
  // Define form schema
  const formSchema = z.object({
    assignedUser: z.string().min(1, { message: "Please select a user" }),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignedUser: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", data);
    alert(`Selected user: ${data.assignedUser}`);
  };

  // Mock API call
  const searchUsers = async (query: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      { value: "user1", label: "John Doe" },
      { value: "user2", label: "Jane Smith" },
      { value: "user3", label: "Robert Johnson" },
    ].filter((user) => user.label.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="w-full max-w-md p-4">
      <h2 className="text-lg font-bold mb-4">React Hook Form Integration</h2>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="assignedUser"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to User</FormLabel>
                <FormControl>
                  <SearchableSelect
                    {...field}
                    name="assignedUser"
                    onSearch={searchUsers}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Form</Button>
        </form>
      </FormProvider>
    </div>
  );
};

// Example 4: Disabled state
export const DisabledExample = () => {
  const users = [
    { value: "user1", label: "John Doe" },
    { value: "user2", label: "Jane Smith" },
  ];

  return (
    <div className="w-full max-w-md p-4">
      <h2 className="text-lg font-bold mb-4">Disabled Example</h2>
      <SearchableSelect
        name="disabledUser"
        // label="Selected User (Disabled)"
        
        items={users}
        defaultValue="user1"
        disabled={true}
      />
    </div>
  );
};
