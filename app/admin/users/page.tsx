"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import HeaderText from "@/components/HeaderText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import NoItems from "@/components/NoItems";
import { axiosInstance } from "@/lib/axios";

interface User {
  id: number;
  username: string;
  role: string;
  isEdit: boolean;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

  const handleEdit = (id: number) => {
    let copyUsers = [...users];
    copyUsers = copyUsers.map((user) => ({ ...user, isEdit: false }));
    const foundUser = copyUsers.findIndex((user) => user.id === id);
    copyUsers[foundUser].isEdit = true;
    setUsers(copyUsers);
  };

  const handleCancel = () => {
    let copyUsers = [...users];
    copyUsers = copyUsers.map((user) => ({ ...user, isEdit: false }));
    setUsers(copyUsers);
  };

  const handleEditUsername = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyUsers = [...users];
    const foundUser = copyUsers.findIndex((user) => user.id === id);
    copyUsers[foundUser].username = e.target.value;
    setUsers(copyUsers);
  };

  const handleEditRole = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    let copyUsers = [...users];
    const foundUser = copyUsers.findIndex((user) => user.id === id);
    copyUsers[foundUser].role = e.target.value;
    setUsers(copyUsers);
  };

  const handleSubmitEdit = async (e: React.FormEvent, user: User) => {
    e.preventDefault();

    if (!user.username || !user.role) return;

    const url = `/api/users/${user.id}`;
    try {
      const response = await axios.put(url, user);
      if (response && response.status === 200) {
        const url = "/api/users";
        const response = await axiosInstance.get(url);

        if (response && response.status === 200 && response.data) {
          const data = response.data.users.map((user: any) => ({
            ...user,
            isEdit: false,
          }));
          setUsers(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const url = `/api/users/${id}`;
      const response = await axiosInstance.delete(url);

      if (response && response.status === 200) {
        const url = "/api/users";
        const response = await axiosInstance.get(url);

        if (response && response.status === 200 && response.data) {
          const data = response.data.users.map((user: any) => ({
            ...user,
            isEdit: false,
          }));
          setUsers(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "/api/users";
        const response = await axiosInstance.get(url);

        if (response && response.status === 200 && response.data) {
          const data = response.data.users.map((user: any) => ({
            ...user,
            isEdit: false,
          }));
          setUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='w-full'>
      <HeaderText>Users</HeaderText>

      {users.length === 0 ? (
        <NoItems />
      ) : (
        <ul className='grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3'>
          {users.map((user, index) => (
            <li key={index}>
              <Card>
                <CardContent className='p-6'>
                  <form onSubmit={(e) => handleSubmitEdit(e, user)}>
                    <div className='space-y-2'>
                      <div className=''>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                          id='name'
                          type='text'
                          value={user.username}
                          onChange={(e) => handleEditUsername(e, user.id)}
                          disabled={!user.isEdit}
                        />
                      </div>
                      <div className=''>
                        <Label htmlFor='role'>Role</Label>
                        <Input
                          id='role'
                          type='text'
                          value={user.role}
                          onChange={(e) => handleEditRole(e, user.id)}
                          disabled={!user.isEdit}
                        />
                      </div>
                    </div>

                    <div className='flex gap-2 mt-4'>
                      {user.isEdit && (
                        <Button
                          type='submit'
                          className='flex-1'
                          variant={user.isEdit ? "default" : "secondary"}
                          // onClick={() => handleSubmitEdit(user.id)}
                        >
                          Submit
                        </Button>
                      )}
                      {!user.isEdit && (
                        <Button
                          className='flex-1'
                          variant={user.isEdit ? "default" : "secondary"}
                          onClick={() => handleEdit(user.id)}
                        >
                          <Pencil size={20} />
                        </Button>
                      )}

                      {user.isEdit && (
                        <Button
                          variant={"destructive"}
                          className='flex-1'
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      )}

                      {!user.isEdit && (
                        <Button
                          variant={"destructive"}
                          className='flex-1'
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={20} />
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
