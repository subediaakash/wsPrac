import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(req, res) {
  try {
    const { username } = req.body;
    const user = await prisma.user.create({
      data: { username },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUserMessages(req, res) {
  try {
    const { userId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: { username: true },
        },
        receiver: {
          select: { username: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
