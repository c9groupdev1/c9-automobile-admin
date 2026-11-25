export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const dns = await import('node:dns');
        const net = await import('node:net');
        // Prefer IPv4 and disable aggressive Happy Eyeballs timeout on networks with unreachable IPv6 or high latency
        dns.setDefaultResultOrder('ipv4first');
        net.setDefaultAutoSelectFamily(false);
    }
}
