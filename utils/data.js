
export const javaVersions = ['9', '10', '11', '15', '17', '18']

export const renderTitle = (title) => (
    <span>{title}</span>
);

export const renderItem = (title) => ({
    value: title,
    label: (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>
            {title}
        </div>
    ),
});

export function groupBy(arr, criteria) {
    const newObj = arr.reduce(function (acc, currentValue) {
        if (!acc[currentValue[criteria]]) {
            acc[currentValue[criteria]] = [];
        }
        acc[currentValue[criteria]].push(currentValue);
        return acc;
    }, {});
    return newObj;
}

export const versionsColors = {
    '9': '#0096c7',
    '10': '#fb8500',
    '11': '#06d6a0',
    '15': '#432818',
    '17': '#e63946',
    '18': '#1d3557'
}

export const stagesColors = {
    'Preview': 'volcano',
    'Incubating': 'gold',
    'Experimental': 'blue',
}

export const stagesDefinitions = {
    'Preview': 'A preview language or VM feature is a new feature of the Java SE Platform that is fully specified, fully implemented, and yet impermanent. It is available in a JDK feature release to provoke developer feedback based on real world use.',
    'Incubating': 'Incubating Features are experimental APIs distributed in a form of separate modules with names prefixed with “jdk.incubator.”.',
    'Experimental': 'Experimental features represent early versions of (mostly) VM-level features, which can be risky, incomplete, or even unstable. In most cases, they need to be enabled using dedicated flags.',
}
