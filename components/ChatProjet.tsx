"use client";

interface Props {
  projetId: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export default function ChatProjet({ projetId, otherUser }: Props) {
  return null;
}
