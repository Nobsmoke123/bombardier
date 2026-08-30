import type { PrismaService } from '../prisma/prisma.service.js';

export async function ensureDefaultApplications(
  prisma: PrismaService,
  userId: string,
): Promise<void> {
  const orphans = await prisma.company.findMany({
    where: { userId, application: { is: null } },
    select: { id: true },
  });

  if (orphans.length === 0) {
    return;
  }

  await prisma.application.createMany({
    data: orphans.map((company) => ({
      companyId: company.id,
      role: '',
    })),
    skipDuplicates: true,
  });
}
