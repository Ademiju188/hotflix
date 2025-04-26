<?php

namespace App\Enums;

enum RolesEnum: string
{
    case SuperAdmin = 'SuperAdmin';
    case Admin = 'Admin';
    case Viewer = 'Viewer';
}
