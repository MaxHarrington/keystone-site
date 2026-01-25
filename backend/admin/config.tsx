// admin/config.tsx

import { jsx } from '@keystone-ui/core';

function CustomLogo () {
    // @ts-ignore
    return <a style={{
        color: '#a82f21',
        // @ts-ignore
        'font-size': '1.5rem',
        'text-decoration': 'none',
        'font-weight': 'bold',
    }}
              href='/'>
        Manager
    </a>
}

export const components = {
    Logo: CustomLogo
}