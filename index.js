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

const startLoading = (functionName) => {
	if (functionName === "set") {
		setButton.textContent = "Setting Mood";
		setButton.disabled = true;
	} else if (functionName === "get") {
		getButton.textContent = "Getting Mood";
		getButton.disabled = true;
	}
};

const endLoading = () => {
	setButton.textContent = "Set Mood";
	getButton.textContent = "Get Mood";
	setButton.disabled = false;
	getButton.disabled = false;
};

const setMood = async (moodValue) => {
	try {
		startLoading("set");
		await MoodContract.setMood(moodValue);
		endLoading();
		showToast("Mood set successfully!");
	} catch (error) {
		endLoading();
		console.log({ setMoodError: error });
		showToast("Some error occurred!");
	}
};

const getMood = async () => {
	try {
		startLoading("get");
		const moodValue = await MoodContract.getMood();

		if (moodValue) {
			getInput.value = moodValue;
		} else {
			getInput.value = "";
		}

		endLoading();
	} catch (error) {
		endLoading();
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
