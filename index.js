const MoodContractAddress = "0xC343D56e5484360Fab6A9d5D3177ccB4DCaD4788";
const MoodContractABI = [
	{
		inputs: [
			{
				internalType: "string",
				name: "_mood",
				type: "string",
			},
		],
		name: "setMood",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "getMood",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

let MoodContract;
let signer;

const provider = new ethers.providers.Web3Provider(window.ethereum, "ropsten");

provider.send("eth_requestAccounts", []).then(() => {
	provider.listAccounts().then((accounts) => {
		signer = provider.getSigner(accounts[0]);
		MoodContract = new ethers.Contract(
			MoodContractAddress,
			MoodContractABI,
			signer
		);
	});
});

const showToast = (message) => {
	Toastify({
		text: message,
		duration: 3000,
		gravity: "bottom",
		position: "center",
		stopOnFocus: true,
		style: {
			background: "linear-gradient(to right, #6a50dc, #8875dd)",
		},
	}).showToast();
};

const setMood = async (moodValue) => {
	try {
		await MoodContract.setMood(moodValue);
		showToast("Mood set successfully!");
	} catch (error) {
		console.log({ setMoodError: error });
		showToast("Some error occurred!");
	}
};

const getMood = async () => {
	try {
		const moodValue = await MoodContract.getMood();
		getInput.value = moodValue;
	} catch (error) {
		console.log({ getMoodError: error });
		showToast("Some error occurred!");
	}
};

const setInput = document.getElementById("set-mood-input");
const getInput = document.getElementById("get-mood-input");
const setButton = document.getElementById("set-button");
const getButton = document.getElementById("get-button");

setButton.addEventListener("click", () => {
	const setMoodValue = setInput?.value;

	if (setMoodValue === "") {
		showToast("Please enter mood!");
	} else {
		setInput.value = "";
		setMood(setMoodValue);
	}
});

getButton.addEventListener("click", () => {
	getMood();
});
