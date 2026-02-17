import { getCurrentUser } from '@/lib/auth';
import { getDashboardData } from '@/lib/dashboard';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await getDashboardData(user.id);
  return Response.json({ ...data, businessName: user.businessName, businessType: user.businessType });
}
