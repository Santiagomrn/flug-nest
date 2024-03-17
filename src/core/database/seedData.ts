import { Role } from '@modules/role/entities/role.entity';
import { ROLES } from '@modules/role/enums/roles.enum';
import { User } from '@modules/user/entities/user.entity';

export async function seed(): Promise<void> {
  const count = await User.count();
  if (count === 0) {
    await Promise.all(
      Object.keys(ROLES).map(async (roleName) => {
        const role = await Role.create({
          name: ROLES[roleName],
          description: ROLES[roleName],
          isDefault: false,
        });
        const user = await User.create({
          firstName: ROLES[roleName],
          email: `${ROLES[roleName]}@example.com`,
          password: 'Passw0rd',
          isActive: true,
        });
        await user.addRole(role.id);
      }),
    );
  }
}
